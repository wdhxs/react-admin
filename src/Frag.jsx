import React from 'react';

// Fragments的作用是能去除返回的最外层的根元素如div
class Table extends React.Component {
    render() {
        return (
            <table>
                <tr>
                    <Colums />
                </tr>
            </table>
        )
    }
}

class Colums extends React.Component {
    render() {
        return (
            // 加了这个就不用外层的div了
            <React.Fragment>
                <td>
                    1
                </td>
                <td>
                    2
                </td>
            </React.Fragment>
        )
    }
}

export default Table;