export type RecipeStatus = 'draft' | 'confirmed'

export interface RecipeIngredient {
    name: string;
    amount?: number;
    unit?: string;
    note?: string;
}

export interface RecipeStep {
    order: number;
    description: string;
    durationMinutes?: number;
}

export interface Recipe {
    id: string;
    groupId: string;
    name: string;
    category: string;
    servings?: number;
    prepMinutes?: number;
    cookMinutes?: number;
    ingredients: RecipeIngredient[];
    steps: RecipeStep[];
    tags?: string[];
    coverImage?: string;
    cookCount?: number;
    sourceText?: string;

    status: RecipeStatus;
    createdBy: string;
    createdAt: number;
}