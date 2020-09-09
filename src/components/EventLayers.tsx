import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Tree } from "antd";
import TextField from "@material-ui/core/TextField";
import { getAllJSDocTags } from "typescript";
import EcoIcon from '@material-ui/icons/Eco';
import {
    EyeInvisibleTwoTone,
    EyeTwoTone,
    MenuOutlined,
    AppstoreOutlined,
    UserAddOutlined,
    PlusSquareOutlined,
    FileOutlined,
    FileAddOutlined,
    MoreOutlined

} from "@ant-design/icons";

{
    id: newItemId,
    name: `${type}-${newItemId}`,
    type:type,
    deleted:false,
    elements: reorder(
      listEvents[source.droppableId],
      source.index,
      destination.index
    ),
  }



const ItemNameWrapper = ({ itemName, itemIcon, onItemNameChange }) => {
    const [doubleClicked, setDoubleClicked] = React.useState(false);
    const [currentName, setCurrentName] = React.useState(itemName);
    return (
        <div onDoubleClick={() => setDoubleClicked(true)}>
            {doubleClicked ? (
                <div>
                    <TextField
                        id={itemName}
                        label={itemName}
                        onChange={(ev) => {
                            const newName = ev.target.value;
                            // do checks here to verify name is unique?
                            setCurrentName(newName);
                        }}
                        onKeyPress={(ev) => {
                            // console.log(`Pressed keyCode ${ev.key}`);
                            if (ev.key === "Enter") {
                                onItemNameChange(itemName, currentName);
                                setDoubleClicked(false);
                            }
                        }}
                    />
                </div>
            ) : (
                    // <div>{itemIcon} {currentName}  <EyeTwoTone /> <MoreOutlined /> </div>
                    <div> {currentName}  <EyeTwoTone /> <MoreOutlined /> </div>

                )}
        </div>
    );
};



const EventLayers = (props) => {

    console.log(props.data)

    function handleNameChange(key, newValue) {

        //search for data that has the key, and change label to newValue;
        let d = [...props.data];
        d.map(dd => {
            if (dd.key == key) {
                dd.label = `${newValue} [${dd.key}]`
            }
            return dd
        })

        props.onChange(d)
    }

    function onDragEnter(info) {
        console.log(info);
        // expandedKeys 需要受控时设置
        // this.setState({
        //   expandedKeys: info.expandedKeys,
        // });
    };

    function onDrop(info) {
        console.log(info);
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split("-");
        const dropPosition =
            info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const loop = (data, key, callback) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children, key, callback);
                }
            }
        };
        const data = [...props.data];

        // Find dragObject
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert 示例添加到尾部，可以是随意位置
                item.children.push(dragObj);
            });
        } else if (
            (info.node.props.children || []).length > 0 && // Has children
            info.node.props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert 示例添加到头部，可以是随意位置
                item.children.unshift(dragObj);
            });
        } else {
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }

        props.onChange(data)
    };

    //create treeData
    let treeData = props.data.map(d => {
        d.title = () => (
            <ItemNameWrapper
                itemName={d.label}
                itemIcon={<EcoIcon />}
                onItemNameChange={handleNameChange}
            />
        )
        return d
    })

    console.log(props.data.map(e => e.title()))


    return (
        <Tree
            // checkable
            // showIcon
            // showLine
            className="draggable-tree hide-file-icon"
            // defaultExpandedKeys={this.state.expandedKeys}
            draggable
            blockNode
            onDragEnter={onDragEnter}
            onDrop={onDrop}
            treeData={treeData}
            TreeNode={() => "value"}
        />
    );
}

export default EventLayers;
