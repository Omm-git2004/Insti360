import { useEffect, useRef, useState } from "react"

export default ({ startingTime, setCanStartExam }) => {

    const currentTime = (parseInt(new Date().toString().split(" ")[4].split(":")[0]) * 60) + parseInt(new Date().toString().split(" ")[4].split(":")[1])
    const timeDiff = startingTime - currentTime - 1;

    const intervalRef = useRef(null)
    const minuteRef = useRef()
    const secondRef = useRef()

    const startInterval = () => {
        intervalRef.current = setInterval(() => {
            let temp = new Date().toString().split(" ")[4].split(":")
            if (parseInt(temp[2]) === 0) minuteRef.current.innerText = `0${parseInt(minuteRef.current.innerText) - 1}`
            secondRef.current.innerText = `${parseInt(temp[2]) >= 50 ? "0" : ""}${59 - parseInt(temp[2])}`

            if (minuteRef.current.innerText == 0 && secondRef.current.innerText == 0) {
                stopInterval();
                setCanStartExam()
            }

        }, 1000)
    }

    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null;
        }
    }

    useEffect(() => {
        startInterval()
    }, [])

    useEffect(() => {
        return () => {
            // Cleanup on component unmount i.e. if another component being opened
            stopInterval();
        };
    }, []);

    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize:"20pt",
        }}>
            <p>Exam Starts In :&nbsp;</p>
            <span ref={minuteRef} >{timeDiff}</span> : <span ref={secondRef} ></span>
        </div>
    )
}