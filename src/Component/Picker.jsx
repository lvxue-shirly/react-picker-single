import React, { Component } from 'react';
import _ from 'lodash';
import propTypes from 'prop-types';
import './Picker.scss';

//获取数据中某一项的索引
const getIndex = (list, item) => {
  if (list &&(list.length < 1)) {
    return 0;
  }
  let index1 = _.findIndex(list, item);
  let index2 =(list.indexOf(item));
  let index = Math.max(index1, index2);
  if (index < 0) {
    throw new Error('list数组中不存在defaultValue');
  }
  return index;
}
//picker组件
class Picker extends Component {
  static propTypes={
    data: propTypes.object.isRequired,
    onChange: propTypes.func.isRequired,// 当停止滑动选中立即回调onchange方法
    handleHide: propTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    console.log(props.data);
    this.startY = 0;//起始坐标
    this.endY   = 0;//结束坐标
    this.currentY = 0;//当前拖动的Y坐标
    this.itemHeight = 50;//行高
    this.selectedIndex = this.getInitialIndex();//默认选中项的索引
    this.state = {style: {}};//选中样式
    this._defaultValue = null;
  }
  //popup
  handleConfirm(){
      // 阻止合成事件的冒泡
      //e.stopPropagation();
      if(this.props.handleHide){
          this.props.handleHide('showSalary');
      }
      this.props.onChange(this.props.data.salaryList[this.selectedIndex]);
  }
  handleCancel(e){
      // 阻止合成事件的冒泡
      e.stopPropagation();
      if(this.props.handleHide){
          this.props.handleHide('showSalary');
      }
  }
  // 初始化获得selectedIndex
  getInitialIndex() {
    // console.log(this.props.data.salaryList);
    let index = getIndex(//选中项的索引
      this.props.data.salaryList,
      this.props.data.defaultSalary
    );
    if (!this.props.data.defaultSalary && this.props.data.salaryList.length > 3) {
      index = Math.round(this.props.data.salaryList.length / 2);
    }//如果没有选中项默认中间选项
    return index;
  }

  componentWillReceiveProps(nextProps) {
    const isEqual = _.isEqual(
      nextProps.data.defaultSalary,
      this._defaultValue
    );
    if (!isEqual) {
      this._defaultValue = nextProps.data.defaultSalary;
      this.selectedIndex = this.getReceivePropsIndex(nextProps.data);
      if (this.selectedIndex === 0) {
        this.setState = {
          style: {
            WebkitTransform: `translate3d(0px, ${this.itemHeight * 2}px, 0px)`
          }
        }
      }
    }
  }

  getReceivePropsIndex (data) {
    if (this._defaultValue) {
      this.selectedIndex = getIndex(
        data.salaryList,
        data.defaultValue
      );
    }
    return this.selectedIndex;
  }

  getInitialStyle () {
    this.currentY = 0;
    if (this.selectedIndex > 2) {
      this.currentY = - (this.selectedIndex - 2) * this.itemHeight;
    } else {
      this.currentY = (2 - this.selectedIndex) * this.itemHeight;
    }
    return `translate3d(0px, ${ this.currentY }px, 0px)`;
  }

  handleTouchStart (e) {
    e.preventDefault();
    if (this.props.data.salaryList.length <= 1) {
      return;
    }
    this.startY = e.nativeEvent.changedTouches[0].pageY;
  }

  handleTouchEnd (e) {
    e.preventDefault();
    if (this.props.data.salaryList.length <= 1) {
      return;
    }
    this.endY = e.nativeEvent.changedTouches[0].pageY;
    // 实际滚动距离
    let v = parseInt((this.endY - this.startY),10);
    let value = v % this.itemHeight;
    // 计算出每次拖动的36px整倍数
    this.currentY += (v - value);
    // 正数y最大值
    const max1 = 2 * this.itemHeight;
    // 负数y最小值
    const max2 = (this.props.data.salaryList.length - 3) * this.itemHeight;
    if (this.currentY > max1) {
      this.currentY = max1;
    }
    else if (this.currentY > 0 && this.currentY < max1) {
      this.currentY = this.currentY;
    }
    else if (this.currentY === max1) {
      this.currentY = this.currentY;
    }
    else if (Math.abs(this.currentY) > max2) {
      this.currentY = - max2;
    }
    this.countListIndex(this.currentY);

    this.setState({
      style: {
        WebkitTransform: `translate3d(0px, ${ this.currentY }px, 0px)`
      }
    });
  }
  handleTouchMove (e) {
    e.preventDefault();
    if (this.props.data.salaryList.length <= 1) {
      return;
    }
    const pageY = e.nativeEvent.changedTouches[0].pageY;
    let value = parseInt((pageY - this.startY),10);
    const y = this.currentY + value;
    let style = `translate3d(0px, ${ y }px, 0px)`;
    this.setState({
      style: {
        WebkitTransform: style
      }
    });
  }
  // 计算list数组索引
  countListIndex (pageY) {
    let n = pageY / this.itemHeight;
    n = n > 0 ? 2 - n : Math.abs(n) + 2;
    this.setSelectedValue(n);
  }
  // set选中值
  setSelectedValue (index) {
    const length = this.props.data.salaryList.length;
    if (length === 0) {
      return;
    }
    if (index < 0 || index > length -1) {
      throw new Error('滑动取值索引数值出现错误'+ index);
    }
    this.selectedIndex = index;
  }
  // 回调
  callback (value) {
    this.props.onChange(value);
  }
  getSelectedClass (index) {
    if (this.selectedIndex === index) {
      return 'picker-item-selected';
    }
    return '';
  }
  componentDidMount () {
    this.setSelectedValue(this.selectedIndex);
  }
  handleWrapperStart (e) {
    e.preventDefault();
  }
  render () {
    const style = {
      WebkitTransform: this.getInitialStyle()
    }
    return (
      <div className="transition">
      <div className="picker-bg" onClick={(e)=>this.handleCancel(e)}></div>
      <div className="picker-wrap">
          <div className="pick-head">
              <span className="popup-title">请选择您期望的薪资范围</span>
              <span className="popup-sure" onClick={this.handleConfirm.bind(this)}>确定</span>
          </div>
          <div className="picker-content" onTouchStart={this.handleWrapperStart.bind(this)}>
              <div className="picker">
                <ul className="picker-list" style = {this.state.style.webkitTransform ? this.state.style : style}
                onTouchStart={this.handleTouchStart.bind(this)}
                onTouchMove={this.handleTouchMove.bind(this)}
                onTouchEnd = {this.handleTouchEnd.bind(this)}>
                    {
                        this.props.data.salaryList.map((data, index) => {
                            const displayValue = this.props.data.displayValue(data);
                            return <li 
                            key = {index}
                            className={ 'item ' + this.getSelectedClass(index)}>
                            {displayValue.tagName}
                            </li>
                        }) 
                    }
                </ul>
              </div>
              <div className="picker-selected"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Picker;