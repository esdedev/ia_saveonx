import serialize from "canonicalize"

export async function canonicalize(value: unknown): Promise<string> {
	//return JSON.stringify(sortRecursively(value));
	return serialize(value) || ""
}
