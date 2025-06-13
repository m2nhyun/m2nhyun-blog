// features/blog-post/services/postService.ts
import { 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDoc, 
    getDocs, 
    query, 
    orderBy, 
    where, 
    Timestamp 
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { auth } from '@/shared/lib/firebase';
import { Post, PostCreateData, PostUpdateData } from '@/entities/post';

const db = getFirestore();
const POSTS_COLLECTION = 'posts';

// 포스트 생성
export const createPost = async (data: PostCreateData): Promise<string> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('로그인이 필요합니다');

        const postData = {
            ...data,
            author: user.displayName || user.email || 'Unknown',
            authorId: user.uid,
            featured: data.featured || false,
            published: data.published || false,
            views: 0,
            likes: 0,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            publishedAt: data.published ? Timestamp.now() : null,
        };

        const docRef = await addDoc(collection(db, POSTS_COLLECTION), postData);
        return docRef.id;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

// 포스트 목록 조회
export const getPosts = async (publishedOnly: boolean = true): Promise<Post[]> => {
    try {
        const postsRef = collection(db, POSTS_COLLECTION);
        let q = query(postsRef, orderBy('createdAt', 'desc'));
        
        if (publishedOnly) {
            q = query(postsRef, where('published', '==', true), orderBy('createdAt', 'desc'));
        }

        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toISOString(),
            updatedAt: doc.data().updatedAt?.toDate().toISOString(),
            publishedAt: doc.data().publishedAt?.toDate().toISOString(),
        })) as Post[];
    } catch (error) {
        console.error('Error getting posts:', error);
        throw error;
    }
};

// 포스트 상세 조회
export const getPost = async (id: string): Promise<Post | null> => {
    try {
        const docRef = doc(db, POSTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate().toISOString(),
                updatedAt: data.updatedAt?.toDate().toISOString(),
                publishedAt: data.publishedAt?.toDate().toISOString(),
            } as Post;
        }
        
        return null;
    } catch (error) {
        console.error('Error getting post:', error);
        throw error;
    }
};

// slug로 포스트 조회
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
    try {
        const postsRef = collection(db, POSTS_COLLECTION);
        const q = query(postsRef, where('slug', '==', slug), where('published', '==', true));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return null;

        const doc = querySnapshot.docs[0];
        const data = doc.data();
        
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString(),
            publishedAt: data.publishedAt?.toDate().toISOString(),
        } as Post;
    } catch (error) {
        console.error('Error getting post by slug:', error);
        throw error;
    }
};

// 포스트 수정
export const updatePost = async (data: PostUpdateData): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('로그인이 필요합니다');

        const { id, ...updateData } = data;
        const docRef = doc(db, POSTS_COLLECTION, id);
        
        await updateDoc(docRef, {
            ...updateData,
            updatedAt: Timestamp.now(),
            publishedAt: data.published ? Timestamp.now() : null,
        });
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
};

// 포스트 삭제
export const deletePost = async (id: string): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('로그인이 필요합니다');

        const docRef = doc(db, POSTS_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

// 조회수 증가
export const incrementViews = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, POSTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const currentViews = docSnap.data().views || 0;
            await updateDoc(docRef, {
                views: currentViews + 1
            });
        }
    } catch (error) {
        console.error('Error incrementing views:', error);
        // 조회수 증가 실패는 조용히 처리
    }
};
