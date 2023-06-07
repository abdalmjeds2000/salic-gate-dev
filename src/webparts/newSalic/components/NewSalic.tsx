import * as React from 'react';
import { INewSalicProps } from './INewSalicProps';
import App from './App/App';


export default class NewSalic extends React.Component<INewSalicProps, {}> {

  public render(): React.ReactElement<INewSalicProps> {
    
    return (
      <App {...this.props} />
    );
  }
}
