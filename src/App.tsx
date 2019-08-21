import React from 'react';
// import './App.css';
import { Button ,message} from 'antd';

class App extends React.Component{

  onSubmit(){
    message.success('hahahah')
  }
  render(){
    return (
      <div className="App">
      <Button type="primary" onClick={this.onSubmit}>Button</Button>
     </div>
    )
  }
}



export default App;
