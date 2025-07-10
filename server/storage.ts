async deleteUserIntegration(id: number, userId: number) {
    return await this.deleteCrmIntegration(id, userId.toString());
  }

  // Legacy compatibility methods for auth system
  async getUserByEmail(email: string): Promise<PublicUser | undefined> {
    return await this.getPublicUserByEmail(email);
  }

  async getUserById(id: number): Promise<PublicUser | undefined> {
    return await this.getPublicUserById(id);
  }

  async createUser(user: InsertPublicUser): Promise<PublicUser> {
    return await this.createPublicUser(user);
  }

  async updateLastLogin(userId: number): Promise<PublicUser | null> {
    const [updated] = await db.update(publicUsers)
      .set({ updatedAt: new Date() })
      .where(eq(publicUsers.id, userId))
      .returning();
    return updated || null;
  }
}

export const storage = new DatabaseStorage();