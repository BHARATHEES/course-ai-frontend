import React from "react";
import { Card, CardContent, Typography } from "@mui/material";


export default function ChartSection() {
    return (
        <Card className="mt-4">
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Popularity Chart
                </Typography>
                <Typography variant="body2">
                    Chart integration (Recharts, Chart.js, or ECharts) goes here.
                </Typography>
            </CardContent>
        </Card>
    );
}