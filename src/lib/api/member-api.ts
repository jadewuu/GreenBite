import type { Member, ProfileInput } from "./types"

export interface MemberApi {
  getCurrent(): Promise<Member>
  updateProfile(input: ProfileInput): Promise<Member>
  setLanguage(language: Member["language"]): Promise<Member>
}

let currentMember: Member = {
  firstName: "Alex",
  lastName: "Green",
  memberId: "GB-2048-8891",
  points: 1230,
  joinedAt: "2025-07-16",
  language: "en",
  birthday: "1990-01-01",
  email: "alex@example.com",
}

const copyMember = () => ({ ...currentMember })

export const memberApi: MemberApi = {
  async getCurrent() {
    return copyMember()
  },

  async updateProfile(input) {
    currentMember = { ...currentMember, ...input }
    return copyMember()
  },

  async setLanguage(language) {
    currentMember = { ...currentMember, language }
    return copyMember()
  },
}
