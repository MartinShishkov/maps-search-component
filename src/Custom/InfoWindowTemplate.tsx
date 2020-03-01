import * as React from 'react';
import ISimpleData from './ISimpleData';

export const InfoWindowTemplate: React.FC<ISimpleData> = (props) =>  
    <div>
        <h2 style={{margin: 0}}>{props.title}</h2>
        <h3 style={{color: props.available ? "green" : "red", margin: 0}}>
            {props.available ? "AVAILABLE" : "NOT AVAILABLE"}
        </h3>
        <table>
            <tr>
                <td style={{width: "200px"}}>
                    <img 
                        src={props.imageUrl} 
                        style={{maxWidth: "200px", height: "80px", objectFit: "cover"}}
                    />
                </td>
                <td>
                    {props.markerText}
                </td>
            </tr>
        </table>
    </div>
