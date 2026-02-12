// Constantes de códigos de relación centralizadas para evitar ciclos de dependencias
export const relationCodes = {
  PARENT: "parent",
  CHILD: "child",
  SIBLING: "sibling",
  SPOUSE: "spouse",
  GRANDPARENT: "grandparent",
  GRANDCHILD: "grandchild",
} as const;
