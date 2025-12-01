export interface CategoryNode {
  id: string;
  name: string;
  children?: CategoryNode[];
}