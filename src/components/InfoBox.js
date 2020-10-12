import React from 'react'
import { Card, CardContent, Typography} from "@material-ui/core";
import '../infoBox.scss';

function InfoBox({title,cases,total, isRed, active, ...props}) {
    return (
        <div>
            <Card onClick={props.onClick}  className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}>
                <CardContent>
                    { /* Title Corona Casos */}
                    <Typography className="infoBox__title" color="textSecondary">
                        {title}
                    </Typography>

                    { /* Número de casos */}
                    <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>

                    { /* Total  */}
                    <Typography className="infoBox__total" color="textSecondary">
                        total {total} 
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default InfoBox
