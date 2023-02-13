import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { db } from '../firebase'
import { getDocs, collection, query, where, collectionGroup } from 'firebase/firestore'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: {
            display: false
        }
    }
};

function LineChart() {

    const [firstEventDate, setFirstEventDate] = useState('');
    const [lastEventDate, setLastEventDate] = useState('');
    const [labels, setLabels] = useState([]);
    const [totalAttendeesArray, setTotalAttendeesArray] = useState(null);
    // const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);

    // we need labels for the chart
    // labels are going to be the dates of all days since the first event was created

    useEffect(() => {
        const getFirstEvent = async () => {

            // get the first event created from events collection...
            // ...by querying for firstEvent field
            const eventsRef = collection(db, "events");
            const eventQuery = query(eventsRef, where("firstEvent", "==", true));
            const eventsQuerySnapshot = await getDocs(eventQuery);

            eventsQuerySnapshot.forEach((doc) => {
                // console.log(doc.data().createdAt.toDate().toLocaleDateString('en-US'));
                setFirstEventDate(doc.data().createdAt.toDate().toLocaleDateString('en-US'));
            });

            setLastEventDate(new Date().toLocaleDateString());
        }

        getFirstEvent();

    }, []);

    useEffect(() => {
        const getDates = (startDate, endDate, steps = 1) => {
            let dateRangeArray = [];
            let currentDate = new Date(startDate);

            while (currentDate <= new Date(endDate)) {
                dateRangeArray.push(new Date(currentDate).toLocaleDateString());

                currentDate.setUTCDate(new Date(currentDate).getUTCDate() + steps);
            }

            return dateRangeArray;
        }

        // console.log(firstEventDate, lastEventDate);
        setLabels(getDates(firstEventDate, lastEventDate));

    }, [firstEventDate, lastEventDate]);

    useEffect(() => {
        const getAttendeesNumber = async (labels) => {

            // console.log(dateArray);
            let totalNumberOfAttendees = [];
            labels.forEach(async (date) => {
                const eventsRef = collection(db, "events");
                const eventsQuery = query(eventsRef, where("eventStartDate", "==", date));
                const eventsQuerySnapshot = await getDocs(eventsQuery);
                let totalAttendees = 0;

                if (eventsQuerySnapshot.docs.length === 0) {
                    totalNumberOfAttendees.push(0);
                }

                else {
                    eventsQuerySnapshot.forEach((doc) => {
                        totalAttendees += doc.data().totalAttendees;
                    })
                    totalNumberOfAttendees.push(totalAttendees);
                };
            })

            setTotalAttendeesArray(totalNumberOfAttendees);
            setLoading(false);
        }

        getAttendeesNumber(labels);

    }, [labels]);

    // useEffect(() => {

    //     const chart = () => {
    //         console.log(labels);
    //         setChartData({
    //             labels,
    //             datasets: [
    //                 {
    //                     label: 'Attendees',
    //                     borderColor: 'rgb(255, 99, 132)',
    //                     backgroundColor: 'rgba(255, 89, 132, 0.5)',
    //                     fill: false,
    //                     lineTension: 0.1,
    //                     pointBorderColor: '#111',
    //                     pointBackgroundColor: 'blue',
    //                     pointBorderWidth: 2,
    //                     data: totalAttendeesArray,
    //                 }
    //             ]
    //         })
    //     }

    //     chart();

    // }, [totalAttendeesArray]);

    const data = {
        labels,
        datasets: [
            {
                label: 'Attendees',
                borderColor: 'rgb(255, 99, 132)',
                fill: false,
                lineTension: 0.1,
                pointBorderColor: '#111',
                pointBackgroundColor: 'blue',
                pointBorderWidth: 2,
                data: totalAttendeesArray,
            }
        ]
    }

    if (loading) {
        return (
            <p>Loading..</p>
        )
    }

    return (
        <section style={{
            margin: 0, padding: 0, width: "500px", height: "400px"
        }}>
            {console.log(totalAttendeesArray)}
            <Line
                options={options}
                data={data}
                redraw />
        </section >
    );
}

export default LineChart;
