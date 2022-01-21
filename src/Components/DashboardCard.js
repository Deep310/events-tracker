import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

function DashboardCard({ bg, title, dataNumber, descText }) {
    return (
        <div>
            <Card sx={{ maxWidth: 250, minHeight: 200, backgroundColor: bg, color: '#fff' }}>
                <CardContent>
                    <Typography sx={{ fontSize: 20, mb: 1.5 }} gutterBottom>
                        {title}
                    </Typography>

                    <Typography sx={{ fontSize: 30, mb: 3 }} >
                        {dataNumber}
                    </Typography>
                    <Typography variant="body1">
                        {descText}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default DashboardCard;
