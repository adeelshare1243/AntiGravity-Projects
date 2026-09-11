'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { AdminRole, ContentStatus } from '@prisma/client';

// ==========================================
// 1. ADMIN USERS (TEAM & ROLES)
// ==========================================

export async function getAdminUsers() {
  try {
    const users = await prisma.adminUser.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // If database has no admin users yet, seed a default superadmin
    if (users.length === 0) {
      const defaultUser = await prisma.adminUser.create({
        data: {
          email: 'talha@soovia.com',
          firstName: 'Muhammad Talha',
          lastName: 'Iftikhar',
          role: AdminRole.SUPERADMIN,
          lastActive: new Date(),
        },
      });
      return [defaultUser];
    }

    return users;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
}

export async function createAdminUser(data: {
  email: string;
  firstName: string;
  lastName: string;
  role?: AdminRole;
  permissions?: Record<string, boolean>;
}) {
  try {
    const user = await prisma.adminUser.create({
      data: {
        email: data.email.toLowerCase().trim(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        role: data.role || AdminRole.SUPPORT,
        permissions: data.permissions || undefined,
        lastActive: new Date(),
      },
    });

    revalidatePath('/admin/team-roles');
    revalidatePath('/admin/staff');
    return { success: true, user };
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return { success: false, error: error.message || 'Failed to create team member' };
  }
}

export async function deleteAdminUser(id: string) {
  try {
    await prisma.adminUser.delete({
      where: { id },
    });

    revalidatePath('/admin/team-roles');
    revalidatePath('/admin/staff');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting admin user:', error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// 2. BLOG CMS
// ==========================================

export async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        author: true,
        category: true,
      },
      orderBy: { publishDate: 'desc' },
    });

    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogCategories() {
  try {
    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return categories;
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  content: string;
  authorId: string;
  categoryId?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDesc?: string;
  status?: ContentStatus;
  publishDate?: Date;
}) {
  try {
    const post = await prisma.blogPost.create({
      data: {
        title: data.title.trim(),
        slug: data.slug.trim(),
        content: data.content,
        authorId: data.authorId,
        categoryId: data.categoryId || null,
        featuredImage: data.featuredImage || null,
        metaTitle: data.metaTitle || null,
        metaDesc: data.metaDesc || null,
        status: data.status || ContentStatus.DRAFT,
        publishDate: data.publishDate || new Date(),
      },
      include: {
        author: true,
        category: true,
      },
    });

    revalidatePath('/admin/blog');
    return { success: true, post };
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return { success: false, error: error.message || 'Failed to create blog post' };
  }
}

export async function createBlogCategory(data: {
  title: string;
  slug: string;
}) {
  try {
    const category = await prisma.blogCategory.create({
      data: {
        title: data.title.trim(),
        slug: data.slug.trim(),
      },
    });

    revalidatePath('/admin/blog');
    return { success: true, category };
  } catch (error: any) {
    console.error('Error creating blog category:', error);
    return { success: false, error: error.message || 'Failed to create blog category' };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath('/admin/blog');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteBlogCategory(id: string) {
  try {
    await prisma.blogCategory.delete({
      where: { id },
    });

    revalidatePath('/admin/blog');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting blog category:', error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// 3. HELP CENTER CMS
// ==========================================

export async function getHelpArticles() {
  try {
    const articles = await prisma.helpArticle.findMany({
      include: {
        author: true,
        category: true,
      },
      orderBy: { publishDate: 'desc' },
    });

    return articles;
  } catch (error) {
    console.error('Error fetching help articles:', error);
    return [];
  }
}

export async function getHelpCategories() {
  try {
    const categories = await prisma.helpCategory.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return categories;
  } catch (error) {
    console.error('Error fetching help categories:', error);
    return [];
  }
}

export async function createHelpArticle(data: {
  title: string;
  slug: string;
  content: string;
  authorId: string;
  categoryId?: string;
  metaTitle?: string;
  metaDesc?: string;
  status?: ContentStatus;
  publishDate?: Date;
}) {
  try {
    const article = await prisma.helpArticle.create({
      data: {
        title: data.title.trim(),
        slug: data.slug.trim(),
        content: data.content,
        authorId: data.authorId,
        categoryId: data.categoryId || null,
        metaTitle: data.metaTitle || null,
        metaDesc: data.metaDesc || null,
        status: data.status || ContentStatus.DRAFT,
        publishDate: data.publishDate || new Date(),
      },
      include: {
        author: true,
        category: true,
      },
    });

    revalidatePath('/admin/help-center');
    return { success: true, article };
  } catch (error: any) {
    console.error('Error creating help article:', error);
    return { success: false, error: error.message || 'Failed to create support article' };
  }
}

export async function createHelpCategory(data: {
  title: string;
  subtitle?: string;
  slug: string;
  icon?: string;
}) {
  try {
    const category = await prisma.helpCategory.create({
      data: {
        title: data.title.trim(),
        subtitle: data.subtitle?.trim() || null,
        slug: data.slug.trim(),
        icon: data.icon || null,
      },
    });

    revalidatePath('/admin/help-center');
    return { success: true, category };
  } catch (error: any) {
    console.error('Error creating help category:', error);
    return { success: false, error: error.message || 'Failed to create help category' };
  }
}

export async function deleteHelpArticle(id: string) {
  try {
    await prisma.helpArticle.delete({
      where: { id },
    });

    revalidatePath('/admin/help-center');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting help article:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteHelpCategory(id: string) {
  try {
    await prisma.helpCategory.delete({
      where: { id },
    });

    revalidatePath('/admin/help-center');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting help category:', error);
    return { success: false, error: error.message };
  }
}
