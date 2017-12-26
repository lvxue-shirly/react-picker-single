import React, { Component } from 'react';
import Picker from './Component/Picker';
import './App.css';

class App extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            showSalary: false,
            salaryTxt: '期望薪资',
            defaultSalary: { tagName: "3000-5000元", tagId: "3000_5000"},
        }
        this.userData = {
            salaryList: this.props.data,
            defaultSalary: this.state.defaultSalary,
            displayValue(item) {
                return item;
            }
        }
    }
    handleChangeSalary(data) {
        data = data || {};
        this.userData.defaultSalary = data;
        this.setState({ defaultSalary: data });
        this.setState({ salaryTxt: data.tagName });//更改文字
    }
    //控制隐藏组件
    handleHide(stateName) {
        this.setState({ [stateName]: false });
    }
    //控制显示组件
    handleShow(e, stateName) {
        e.stopPropagation();
        this.setState({ [stateName]: true });
    }
    render() {
        let { showSalary, salaryTxt } = this.state;
        return (
            <div className="App">
                <div className="opr-item" onClick={(e) => this.handleShow(e, "showSalary")}>
                    {salaryTxt === '期望薪资' ? (<span className="single-big">{salaryTxt}</span>) : <div><span className="small-title">期望薪资</span><span className="changed-text">{salaryTxt}</span></div>}
                </div>
                {showSalary && <Picker onChange={this.handleChangeSalary.bind(this)} data={this.userData} handleHide={this.handleHide.bind(this)} />}
            </div>

        );
    }
}

export default App;
