import type { Member, ProfileInput } from "./types"

export interface MemberApi {
  getCurrent(): Promise<Member>
  updateProfile(input: ProfileInput): Promise<Member>
  setLanguage(language: Member["language"]): Promise<Member>
}

let currentMember: Member = {
  firstName: "John",
  lastName: "Hart",
  memberId: "GB12345678",
  points: 1230,
  joinedAt: "2024-11-27",
  language: "en",
  birthday: "1990-01-01",
  email: "john@example.com",
  memberCode: "123456789999999999999",
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
