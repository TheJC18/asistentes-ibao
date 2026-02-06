export const relationCodes = {
  PARENT: "parent",
  CHILD: "child",
  SIBLING: "sibling",
  SPOUSE: "spouse",
  GRANDPARENT: "grandparent",
  GRANDCHILD: "grandchild",
};

export const inverseRelationsMap: Record<string, Record<string, string>> = {
  [relationCodes.PARENT]: {
    male: relationCodes.CHILD,
    female: relationCodes.CHILD,
    other: relationCodes.CHILD,
    neutral: relationCodes.CHILD,
  },
  [relationCodes.CHILD]: {
    male: relationCodes.PARENT,
    female: relationCodes.PARENT,
    other: relationCodes.PARENT,
    neutral: relationCodes.PARENT,
  },
  [relationCodes.SIBLING]: {
    male: relationCodes.SIBLING,
    female: relationCodes.SIBLING,
    other: relationCodes.SIBLING,
    neutral: relationCodes.SIBLING,
  },
  [relationCodes.SPOUSE]: {
    male: relationCodes.SPOUSE,
    female: relationCodes.SPOUSE,
    other: relationCodes.SPOUSE,
    neutral: relationCodes.SPOUSE,
  },
  [relationCodes.GRANDPARENT]: {
    male: relationCodes.GRANDCHILD,
    female: relationCodes.GRANDCHILD,
    other: relationCodes.GRANDCHILD,
    neutral: relationCodes.GRANDCHILD,
  },
  [relationCodes.GRANDCHILD]: {
    male: relationCodes.GRANDPARENT,
    female: relationCodes.GRANDPARENT,
    other: relationCodes.GRANDPARENT,
    neutral: relationCodes.GRANDPARENT,
  },
};

export const getInverseRelation = (
  relationCode: string,
  gender: string = "neutral"
): string => {
  const genderKey = gender.toLowerCase() as
    | "male"
    | "female"
    | "other"
    | "neutral";
  return inverseRelationsMap[relationCode]?.[genderKey] || relationCode;
};
