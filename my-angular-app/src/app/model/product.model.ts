export interface Product {
    category?: string;
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    ownerId: string;
    likes: string[];
    dislikes: string[];
    colorImages?: { color: string; imageUrl: string }[];
}