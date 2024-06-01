'use client';

import React from 'react';
import { Checkbox } from '@mui/material';
import {
  RichTreeView,
  SimpleTreeView,
  TreeItem,
  TreeItem2,
  TreeItem2Label,
  TreeItem2Props,
  UseTreeItem2ContentSlotOwnProps,
  useTreeItem2Utils,
} from '@mui/x-tree-view';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { string } from 'zod';

import { MenuProps } from '@/types/nav';

interface CustomLabelProps {
  itemId: string;
  children: string;
  className: string;
  onChange: (value: string) => void;
}
// 트리 컴포넌트
export const FrameTree = ({ data }: { data: MenuProps[] }) => {
  const filterList = data.filter((row) => row.menuLevel === 1);
  if (filterList == null || filterList.length == 0) return '';
  return (
    <SimpleTreeView
      expandedItems={data.map((customer) => customer.menuId)}
      sx={{ overflowX: 'hidden', overflowY: 'auto', minHeight: 200, flexGrow: 1, maxWidth: 330, minWidth: 150 }}
      slots={
        {
          //  expandIcon: AddBoxIcon,
          //  collapseIcon: IndeterminateCheckBoxIcon,
          //  endIcon: CloseSquare,
        }
      }
    >
      {filterList.map((rootNode, index) => (
        <TreeItem
          key={rootNode.menuId}
          itemId={rootNode.menuId}
          label={rootNode.menuName}
          disabled={rootNode.chk === 'N' && true}
        >
          <FrameTreeNode key={rootNode.menuId} nodeList={data} upid={rootNode.menuId} />
        </TreeItem>
      ))}
    </SimpleTreeView>
  );
};
// 트리 컴포넌트
const FrameTreeNode = ({ nodeList, upid }: { nodeList: MenuProps[]; upid: string }) => {
  const fList = nodeList.filter((row) => row.upMenuId === upid);
  return (
    <>
      {fList.map((child: MenuProps, index) => (
        <TreeItem
          itemId={child.menuId}
          label={(child.chk === 'Y' ? '<O>' : '<X>') + child.menuName}
          disabled={child.chk === 'N' && true}
          key={child.menuId}
        >
          {nodeList.findIndex((group) => group.upMenuId === child.menuId) > 0 && (
            <FrameTreeNode key={child.menuId} nodeList={nodeList} upid={child.menuId} />
          )}
        </TreeItem>
      ))}
    </>
  );
};
// 트리 컴포넌트
const setRichTreeView = (data: MenuProps[]) => {
  const filterList = data.filter((row) => row.menuLevel === 1);
  const items: TreeViewBaseItem[] = [];

  filterList.map((rootNode) => {
    items.push({
      id: rootNode.menuId + '#' + rootNode.chk,
      label: rootNode.menuName,
      children: setRichTreeView2(data, rootNode.menuId),
    });
  });

  return items;
};

export const setRichTreeView2 = (nodeList: MenuProps[], upid: string) => {
  const fList = nodeList.filter((row) => row.upMenuId === upid);
  const children: TreeViewBaseItem[] = [];

  fList.map((child: MenuProps) => {
    let childrenRow: TreeViewBaseItem = { id: child.menuId + '#' + child.chk, label: child.menuName };

    if (nodeList.findIndex((group) => group.upMenuId === child.menuId) > 0) {
      childrenRow['children'] = setRichTreeView2(nodeList, child.menuId);
    }

    children.push(childrenRow);
  });

  return children;
};

export const FrameRichTree = ({ data }: { data: MenuProps[] }) => {
  const items = setRichTreeView(data);

  return <RichTreeView items={items} slots={{ item: TreeItem2 }} />;
};

/*
export const FrameInputRichTree = ({ data }: { data: MenuProps[] }) => {}
*/
export const FrameInputRichTree = ({
  data,
  setChangeData,
}: {
  data: MenuProps[];
  setChangeData: (id: string, value: string) => void;
}) => {
  const items = setRichTreeView(data);
  const context = React.useMemo(
    () => ({
      onLabelValueChange: (itemId: string, label: string) => {
        setChangeData(itemId, label);
      },
      // setTreeItems

      /*
        setTreeItems((prev) => {
          const walkTree = (item: TreeViewBaseItem): TreeViewBaseItem => {
            if (item.id === itemId) {
              return { ...item, label };
            }
            if (item.children) {
              return { ...item, children: item.children.map(walkTree) };
            }

            return item;
          };
          return prev.map(walkTree);

        }),
       */
    }),
    []
  );

  return (
    <TreeItemContext.Provider value={context}>
      <RichTreeView
        items={items}
        aria-label="customized"
        // defaultExpandedItems={['W_1000001']}
        sx={{ overflowX: 'hidden', minHeight: 224, flexGrow: 1, maxWidth: 300 }}
        slots={{ item: CustomTreeItem }}
      />
    </TreeItemContext.Provider>
  );
};

function CustomLabel(props: CustomLabelProps) {
  const { itemId, children, onChange, ...other } = props;

  const [isChecked, setIsChecked] = React.useState<boolean>(itemId.split('#')[1] === 'Y' ? true : false);
  /*
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [value, setValue] = React.useState('');
  const editingLabelRef = React.useRef<HTMLInputElement>(null);

  const handleLabelDoubleClick = () => {
    setIsEditing(true);
    setValue(children);
  };

  const handleEditingLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleEditingLabelKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.stopPropagation();
      setIsEditing(false);
      onChange(value);
    } else if (event.key === 'Escape') {
      event.stopPropagation();
      setIsEditing(false);
    }
  };

  React.useEffect(() => {
    if (isEditing) {
      editingLabelRef.current?.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <>
        <input type="checkbox" />
        <input
          value={value}
          onChange={handleEditingLabelChange}
          onKeyDown={handleEditingLabelKeyDown}
          ref={editingLabelRef}
        />
      </>
    );
  }
*/
  return (
    <>
      <Checkbox
        name="user_served_yn"
        checked={isChecked}
        value={itemId.split('#')[0]}
        onChange={(event) => {
          setIsChecked(event.target.checked);
          onChange(event.target.checked ? 'Y' : 'N');
        }}
      />
      <TreeItem2Label {...other}>{children}</TreeItem2Label>
    </>
  );
}

const TreeItemContext = React.createContext<{
  onLabelValueChange: (itemId: string, label: string) => void;
}>({ onLabelValueChange: () => {} });

const CustomTreeItem = React.forwardRef((props: TreeItem2Props, ref: React.Ref<HTMLLIElement>) => {
  const { interactions } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });

  const { onLabelValueChange } = React.useContext(TreeItemContext);

  const handleLabelValueChange = (newLabel: string) => {
    onLabelValueChange(props.itemId, newLabel);
  };
  /*
  const handleContentClick: UseTreeItem2ContentSlotOwnProps['onClick'] = (event) => {
    event.defaultMuiPrevented = true;
    interactions.handleSelection(event);
  };

  const handleIconContainerClick = (event: React.MouseEvent) => {
    interactions.handleExpansion(event);
  };
*/
  return (
    <TreeItem2
      ref={ref}
      {...props}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        //  content: { onClick: handleContentClick },
        //  iconContainer: { onClick: handleIconContainerClick },
        label: {
          onChange: handleLabelValueChange,
          itemId: props.itemId,
        } as any,
      }}
    />
  );
});
