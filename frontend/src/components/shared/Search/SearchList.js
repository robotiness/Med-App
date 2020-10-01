import { initial } from 'lodash';
import React from 'react';

export default class SearchList extends React.Component {
    constructor(props) {
        super(props);
    }
    // componentWillReceiveProps = (newProps) => {
    //     if (newProps != this.props) {
    //         this.props = newProps;
    //         console.log(this.props);
    //         this.forceUpdate();
    //     }
    // }
    render() {
        let checkBoxStyle = {
            color:this.props.color,
            marginLeft:'0px',
            transform: "scale(1.5)"
        }
        let header = () => {
            return this.props.itemObj.tableData[0].map((item, key) => {
                return (
                    <th scope="col" colSpan={item.colSpan} key={'header' + key}>{item.value}</th>
                )
            });
        }

        let body = (list) => {
            return list.map((item, key) => {
                return (
                    <td colSpan={this.props.itemObj.tableData[0][key].colSpan}>{item}</td>
                )
            });
        }
        let rows = () => {
            let rowLen = this.props.itemObj.tableData[1].length / this.props.itemObj.tableData[0].length;
            let rows = [];
            /*
             0   0,1,2,3
             1   4,5,6,7
             2  8,9,10,11

             start: 4*row
             end:   start + colLen-1
            */

            for (var i = 0; i < rowLen; ++i) {
                let list = JSON.parse(JSON.stringify(this.props.itemObj.tableData[1]));

                let itemLen = this.props.itemObj.tableData[0].length;
                let start = i * itemLen;
                let end = itemLen; 
                // let end = start + itemLen;
                let key = this.props.itemObj.values[i];
                console.log(list)
                list = list.splice(start, end);
                console.log(start);
                console.log(end)
                console.log(list)
                
                if(!this.props.itemObj.hiddenValues.includes(key)){
                    rows.push(
                        <tr key={"row" + i}>
                            <td>{this.props.itemObj.selectedValues.includes(key)?
                                <i id={i} style={checkBoxStyle} class="fas fa-check-square" onClick={this.props.toggleAll}></i>
                                :
                                <i id={i} style={checkBoxStyle} class="far fa-square" onClick={this.props.toggleAll}></i> 
                                }
                            </td>
                            {body(list)}
                        </tr>
                    );
                }
            }
            return rows;
        }

        return (
            <>
                {this.props.itemObj.tableData[1].length > 0 ?
                    <table className="table dependentTable my-search-table" style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th>
                                    {this.props.itemObj.selectedValues.length == this.props.itemObj.values.length?
                                        <i style={checkBoxStyle} class="fas fa-check-square" onClick={()=>this.props.toggleAll()}></i>
                                        :
                                        <i style={checkBoxStyle} class="far fa-square" onClick={()=>this.props.toggleAll()}></i>
                                    }
                                </th>
                                {header()}
                            </tr>
                        </thead>
                        <tbody>
                            {rows()}
                            {/* {list(this.props.users)} */}
                        </tbody>
                    </table>
                    : null}
            </>
        )
    }
}