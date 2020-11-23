import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import PropTypes from 'prop-types';


export default class RichTextEditor extends Component {

    static propTypes = {
        detail: PropTypes.string
    }

    // state = {
    //     editorState: EditorState.createEmpty(),
    // }

    constructor(props) {
        super(props);
        const html = this.props.detail;
        if (html) {
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            }
        } else {
            this.state = {
                // 创建一个没有内容的编辑对象
                editorState: EditorState.createEmpty()
            };
        }
      }

    onEditorStateChange = (editorState) => {
        this.setState({
        editorState,
        });
    };
    // 返回输入数据所对应的HTML文本
    getDetail = () => draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));

    render() {
        const { editorState } = this.state;
        return (
        <div>
            <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            editorStyle={{
                minHeight: 200,
                border: "1px solid black",
                paddingLeft: 10
            }}
            onEditorStateChange={this.onEditorStateChange}
            />
            {/* <textarea
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            /> */}
        </div>
        );
    }
}