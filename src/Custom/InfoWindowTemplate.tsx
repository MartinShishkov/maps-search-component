import * as React from 'react';
import ISimpleData from './ISimpleData';

export const InfoWindowTemplate: React.FC<ISimpleData> = (props) =>  
    <div>
        <h2 style={{margin: 0}}>{props.title}</h2>
        {props.available 
        ? (
            <h3 style={{color: "green", margin: 0}}>AVAILABLE</h3>
        )
        : (
            <h3 style={{color: "red", margin: 0}}>NOT AVAILABLE</h3>
        )}
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
