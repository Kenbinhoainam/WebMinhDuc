import React from 'react';
import {prerenderToNodeStream} from 'react-dom/static';
import {StaticRouter} from 'react-router-dom';
import App from './App';
import {RouteMetadata} from './seo/RouteMetadata';
export {pages,seo} from './seo/routes';
export async function render(url:string):Promise<string>{
 const {prelude}=await prerenderToNodeStream(<React.StrictMode><StaticRouter location={url}><RouteMetadata/><App/></StaticRouter></React.StrictMode>);
 let body=''; for await(const chunk of prelude) body+=chunk.toString(); return body;
}
