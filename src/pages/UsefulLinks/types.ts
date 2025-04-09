
export interface UsefulLink {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string;
  icon: string | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}
