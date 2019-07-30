import { NodeItem } from './node-item';

export interface TreeCallbacks {

  /**
  *
  * Callback triggers on name click.
  *
  */
  nameClick?: (item: NodeItem<any>) => void;

  /**
  *
  * Callback triggers on node selection.
  *
  */
  select?: (item: NodeItem<any>) => void;

  /**
  *
  * Callback triggers on unselection of a node.
  *
  */
  unSelect?: (item: NodeItem<any>) => void;

  /**
  *
  *  Callback triggers on toggling of a node.
  *
  */
  toggle?: (item: NodeItem<any>) => void;
}
