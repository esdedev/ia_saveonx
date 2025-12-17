// utils/otsHelper.ts
import { db } from '@/drizzle/db';
import { TimestampTable } from '@/drizzle/schema/timestamp';
import { getServerSession } from '@/services/auth/auth-server';
import { 
  read, 
  verify, 
  info, 
  type Timestamp, 
  verifiers
} from '@lacrypta/typescript-opentimestamps';
import { and, eq } from 'drizzle-orm';

// Definimos una interfaz para tu resultado deseado
interface OtsDetails {
  timestamp?: number;
  date?: string;
  blockHeight?: number;
  merkleTree?: string; // Representación legible del árbol
  isVerified: boolean;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;
  
  const session = await getServerSession();

  const row = await db.query.TimestampTable.findFirst({
    where: and(
      eq(TimestampTable.postId, postId),
      eq(TimestampTable.userId, session?.user.id || ""),
    ),
  })

  if (!row?.otsBytes) {
    return new Response("Not found", { status: 404 })
  }

  try {
    const otsDetails = await analyzeOts(row.otsBytes);
    return new Response(JSON.stringify(otsDetails), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  catch (error) {
    return new Response("Error processing OTS data", { status: 500 });
  }
}

export const analyzeOts = async (buffer: Buffer<ArrayBufferLike>): Promise<OtsDetails> => {
  try {
    // 1. Convertir HEX a Uint8Array (formato que usa esta librería)
    //const buffer = Uint8Array.from(Buffer.from(hexString, 'hex'));

    // 2. Deserializar el archivo (Parsear)
    const timestampObj: Timestamp = read(buffer);

    // 3. Obtener el Árbol de Merkle (Info legible)
    // La función 'info()' devuelve la estructura completa (operaciones y atestaciones)
    const merkleTreeInfo = info(timestampObj);

    // 4. Verificar para obtener la fecha confirmada
    // 'verify' devuelve un objeto con las atestaciones verificadas
    // NOTA: Requiere conexión a internet para consultar los nodos de Bitcoin
    const verificationResult = await verify(timestampObj, verifiers);
    
    // Extraemos la fecha (las keys del objeto son los timestamps en formato unix)
    // verificationResult.attestations es Record<number, string[]>
    const timestamps = Object.keys(verificationResult.attestations).map(Number);
    const confirmedTime = timestamps.length > 0 ? Math.min(...timestamps) : undefined;

    // 5. Extraer manualmente la altura del bloque (Block Height)
    // La librería @lacrypta encapsula esto, pero podemos buscar en el string de 'info'
    // o recorrer el objeto si necesitamos el número exacto.
    // El método más robusto sin forzar tipos privados es usar regex sobre info() 
    // o buscar la atestación de Bitcoin en la estructura.
    
    let blockHeight: number | undefined;
    
    // Buscamos patrones tipo "Bitcoin block header ... height 928022" en la info
    // o iteramos si la librería expusiera las atestaciones públicamente en el tipo.
    const blockMatch = merkleTreeInfo.match(/Bitcoin block header.*height\s(\d+)/i);
    if (blockMatch && blockMatch[1]) {
      blockHeight = parseInt(blockMatch[1], 10);
    }

    return {
      timestamp: confirmedTime,
      date: confirmedTime ? new Date(confirmedTime * 1000).toLocaleString() : undefined,
      blockHeight: blockHeight,
      merkleTree: merkleTreeInfo,
      isVerified: timestamps.length > 0
    };

  } catch (error) {
    console.error("Error analizando OTS:", error);
    throw error;
  }
};