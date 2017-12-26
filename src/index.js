import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

let salary_intension = [
    { tagName: "3000-5000元", tagId: "3000_5000"},
    { tagName: "8000-10000元", tagId: "8000-10000"},
    { tagName: "3000-5000元", tagId: "3000_5000"},
    { tagName: "8000-10000元", tagId: "8000-10000"},
    { tagName: "3000-5000元", tagId: "3000_5000"},
    { tagName: "8000-10000元", tagId: "8000-10000"},
    { tagName: "3000-5000元", tagId: "3000_5000"},
    { tagName: "8000-10000元", tagId: "8000-10000"},
    { tagName: "3000-5000元", tagId: "3000_5000"},
    { tagName: "8000-10000元", tagId: "8000-10000"},
    { tagName: "一万以上", tagId: "10000"}
];

ReactDOM.render(<App data={salary_intension} />, document.getElementById('root'));
