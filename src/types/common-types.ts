export type Gpsi = string;

export type Supi = string;

export type Msisdn = string;

export type ExternalId = string;

export type UeIdentity = string;

const UE_IDENTITY_PATTERNS = {
  msisdn: /^msisdn-[0-9]{5,15}$/,
  extid: /^extid-[^@]+@[^@]+$/,
  extgroupid: /^extgroupid-[^@]+@[^@]+$/,
  imsi: /^imsi-[0-9]{5,15}$/,
  nai: /^nai-.+$/,
  gci: /^gci-.+$/,
  gli: /^gli-.+$/,
  anyUE: /^anyUE$/
};

export function validateUeIdentity(ueIdentity: string, allowedTypes?: (keyof typeof UE_IDENTITY_PATTERNS)[], allowCatchAll: boolean = false): boolean {
  if (!ueIdentity || ueIdentity.trim() === '') {
    return false;
  }

  const typesToCheck = allowedTypes || Object.keys(UE_IDENTITY_PATTERNS) as (keyof typeof UE_IDENTITY_PATTERNS)[];
  
  const matchesPattern = typesToCheck.some(type => {
    const pattern = UE_IDENTITY_PATTERNS[type];
    return pattern && pattern.test(ueIdentity);
  });

  if (matchesPattern) {
    return true;
  }

  if (allowCatchAll) {
    for (const type of typesToCheck) {
      const prefix = type + '-';
      if (ueIdentity.startsWith(prefix)) {
        return false;
      }
    }
    return true;
  }

  return false;
}

export function createInvalidParameterError(detail: string) {
  return {
    type: 'urn:3gpp:error:invalid-parameter',
    title: 'Bad Request',
    status: 400,
    detail,
    cause: 'INVALID_PARAMETER'
  };
}