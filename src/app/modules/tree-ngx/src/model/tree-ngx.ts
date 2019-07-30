import { NodeItem } from './node-item';

export interface TreeNgx {

  /**
   * Add a new node to the tree.
   *
   * @param nodeItem - The node to be added
   * @param id - Id of the parent node, if null add to root
   */
  addNodeById(nodeItem: NodeItem<any>, id?: string): void;

  /**
   * Delete a node from the tree.
   *
   * @param id - Id of the node
   */
  deleteById(id: string): void;

  /**
   *
   * @param id - Id of the node
   * @param name - New name of the node
   */
  editNameById(id: string, name: string): void;

  /**
   *
   * @param id  - Id of the node.
   * @param item - New item of the node
   */
  editItemById(id: string, item: any): void;

  /**
   * Expand all parents of a node.
   *
   * @param id - Id of the node
   */
  expandById(id: string): void;

  /**
  * Get the parent of a node.
  *
  * @param id - Id of the node
  *
  * @returns - The parent of the node
  */
  getParentById(id: string): NodeItem<any>;

  /**
   *
   * Expand all nodes.
   */
  expandAll(): void;

  /**
   *
   * Collapse all nodes.
   */
  collapseAll(): void;

}
