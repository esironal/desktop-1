!(function () {
    setTimeout(function () {
        var itemList = [], itemCardMap = {}, currentId;
        itemList2.forEach(function (item, i) {
            var json = {
                id: item.id,
                name: item.name,
                cardId: item.cardId,
                pId: item.pId,
                parentId: item.parentId,
                open: true
            };
            if (item.cardId) {
                if (itemCardMap[item.pId]) {
                    itemCardMap[item.pId].push(json);
                } else {
                    itemCardMap[item.pId] = [json];
                }
            } else {
                itemList.push(json);
            }
        });
        cardList.forEach(function (item) {
            item.icon = undefined;
            item.cardParentId = item.pId;
            item.open = true;
        });

        var addNodeForMap = function (node) {
            var json = { name: node.name, id: node.id, cardId: node.cardId, pId: node.pId, parentId: node.parentId };

            if (itemCardMap[currentId]) {
                itemCardMap[currentId].push(json);
            } else {
                itemCardMap[currentId] = [json];
            }
        };

        var removeNodeForMap = function (node, pId) {
            var json = { name: node.name, id: node.id, cardId: node.cardId, pId: node.pId };

            if (!itemCardMap[pId]) {
                return;
            }
            itemCardMap[pId].forEach(function (item, i) {
                if (item.id == node.id) {
                    itemCardMap[pId].splice(i, 1);
                }
            });
        };

        var itemTree = Design.widget('tree', {
            title: {
                text: '帐户项'
            },
            toolbar: [
                {
                    dock: 'top',
                    items: [
                        {
                            xtype: 'textfield',
                            label: '关键字',
                            labelWidth: 50,
                            id: 'itemText',
                            fieldStyle: {
                                width: 100
                            },
                            handler: function () {
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'icon-plus',
                            label: '搜索',
                            handler: function () {
                                var value = Design.getCmp('itemText').getValue();

                                itemTree.searchNode(value);
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'icon-plus',
                            style: {
                                'float': 'left'
                            },
                            label: '取消关联',
                            handler: function () {
                                var itemTreeObj = itemTree.getObject();
                                var itemCardObj = itemCard.getObject();
                                var cardTreeObj = cardTree.getObject();
                                itemTreeObj.transformToArray(itemTreeObj.getSelectedNodes()).forEach(function (node) {
                                    if (!itemCardMap[node.id]) {
                                        return;
                                    }
                                    itemCardMap[node.id].forEach(function (item) {
                                        if (item.cardId) {
                                            cardTreeObj.addNodes(cardTreeObj.getNodesByParam('id', item.parentId)[0], item);
                                            itemCardObj.removeNode(itemCardObj.getNodesByParam('id', item.id)[0]);
                                        }
                                    });
                                    itemCardMap[node.id] = [];
                                });
                            }
                        }
                    ]
                }
            ],
            setting: {
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: function (e, d, treeNode) {
                        if (!treeNode.isParent) {
                            itemCard.bindData(itemCardMap[treeNode.id]);
                            currentId = treeNode.id;
                            itemCard.setTitle('卡片:' + treeNode.name);
                        } else {
                            itemCard.setTitle('无法添加卡片:' + treeNode.name);
                            itemCard.setHtml("<h1></h1>");
                            currentId = undefined;
                        }
                    },
                    onDrop: function (event, treeId, treeNodes) {
                        alert('ff');
                    }
                }
            },
            style: {
                width: '40%',
                height: '100%',
                'float': 'left'
            },
            bodyStyle: {
                overflow: 'auto'
            },
            datas: itemList
        });

        var cardTree = Design.widget('tree', {
            title: {
                text: '卡片'
            },
            toolbar: [
                {
                    dock: 'top',
                    items: [
                        {
                            xtype: 'textfield',
                            label: '关键字',
                            labelWidth: 50,
                            id: 'cardText',
                            fieldStyle: {
                                width: 100
                            },
                            handler: function () {
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'icon-plus',
                            label: '搜索',
                            handler: function () {
                                var value = Design.getCmp('cardText').getValue();

                                cardTree.searchNode(value);
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'icon-plus',
                            style: {
                                'float': 'left'
                            },
                            label: '关联卡片',
                            handler: function () {
                                if (!currentId) {
                                    alert("请选择帐户项");
                                    return;
                                }
                                var cardTreeObj = cardTree.getObject();
                                var nodes = cardTree.getObject().getSelectedNodes();
                                var itemCardObj = itemCard.getObject();

                                nodes.forEach(function (node) {
                                    if (node.isGroup) {
                                        alert(node.name + " 不是卡片项");
                                        return;
                                    }
                                    itemCardObj.addNodes(null, node);
                                    cardTreeObj.removeNode(node);
                                    addNodeForMap(node);

                                    var pNode = cardTree.getObject().getNodesByParam('id', node.parentId)[0];
                                    pNode.iconSkin = " ico_open ";

                                    cardTree.getObject().updateNode(pNode);
                                });
                            }
                        }
                    ]
                }
            ],
            setting: {
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeDrop: function (treeId, treeNodes, targetNode, moveType) {
                        var node = cardTree.getObject().getNodesByParam('id', treeNodes[0].parentId)[0];
                        node.iconSkin = " ico_open ";

                        cardTree.getObject().updateNode(node);
                        return !treeNodes[0].isGroup;
                    },
                    onDrop: function (event, treeId, treeNodes, targetNode) {
                        if (!treeNodes)
                            return;
                        treeNodes.forEach(function (node) {
                            addNodeForMap(node);
                        });
                    }
                },
                edit: {
                    drag: {
                        autoExpandTrigger: true,
                        prev: function () {
                            return true;
                        },
                        inner: function (treeId, nodes, targetNode) {
                            return true;
                        },
                        next: function () {
                            return true;
                        }
                    },
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false
                }
            },
            style: {
                width: '40%',
                height: '100%',
                'float': 'left'
            },
            bodyStyle: {
                overflow: 'auto'
            },
            datas: cardList
        });

        var itemCard = Design.widget('tree', {
            title: {
                text: '被关联卡片列表'
            },
            toolbar: [
                {
                    dock: 'top',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'icon-plus',
                            style: {
                                'float': 'left'
                            },
                            label: '取消关联',
                            handler: function () {
                                var itemCardObj = itemCard.getObject();
                                var cardTreeObj = cardTree.getObject();
                                itemCardObj.getSelectedNodes().forEach(function (node) {
                                    cardTreeObj.addNodes(cardTreeObj.getNodesByParam('id', node.parentId)[0], node);
                                    itemCardObj.removeNode(node);
                                    removeNodeForMap(node);
                                });
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'icon-plus',
                            style: {
                                'float': 'left'
                            },
                            label: '取消所有关联',
                            handler: function () {
                                var itemCardObj = itemCard.getObject();
                                var cardTreeObj = cardTree.getObject();
                                itemCardObj.transformToArray(itemCardObj.getNodes()).forEach(function (node) {
                                    if (!node.cardId) {
                                        return;
                                    }
                                    cardTreeObj.addNodes(cardTreeObj.getNodesByParam('id', node.parentId)[0], node);
                                    itemCardObj.removeNode(node);
                                    removeNodeForMap(node);
                                });
                            }
                        }
                    ]
                }
            ],
            style: {
                width: '20%',
                height: '100%',
                'float': 'left'
            },
            setting: {
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: function (e, d, treeNode) {
                        treeNode.parentId;
                        var node = cardTree.getObject().getNodesByParam('id', treeNode.parentId)[0];
                        itemCard.getObject().selectNode(treeNode, false);
                        cardTree.getObject().selectNode(node, false);
                    }
                },
                edit: {
                    drag: {
                        autoExpandTrigger: true,
                        prev: function () {
                            return currentId;
                        },
                        inner: function (treeId, nodes, targetNode) {
                            //itemCardMap[targetNode]
                            return !targetNode && currentId;
                        },
                        next: function () {
                            return currentId;
                        }
                    },
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false
                }
            },
            bodyStyle: {
                overflow: 'auto'
            },
            datas: []
        });
        Design.define('Design.app.SuperTree', {
            extend: 'Design.panel.Panel',
            style: {
                width: 1200,
                height: 500
            },
            items: [itemTree, itemCard, cardTree]
        });
    }, 1000);
})();
