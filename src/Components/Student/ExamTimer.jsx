import { useContext, useEffect, useRef } from "react";
import { useExamContext } from "../../Context_API/ExamContext";

export default ({ duration }) => {

    const { handleSubmit } = useExamContext()

    const intervalRef = useRef(null)

    const minuteRef = useRef()
    const secondRef = useRef()
    const hourRef = useRef()


    const startInterval = () => {
        intervalRef.current = setInterval(() => {
            let second = parseInt(secondRef.current.innerText);
            let minute = parseInt(minuteRef.current.innerText)

            if (second === 0) {

                if (minute === 0 && hourRef.current.innerText == 0) {
                    stopInterval()
                }

                secondRef.current.innerText = "59"
                minuteRef.current.innerText = minute === 0 ? "59" : minute - 1
                if (minute === 0) hourRef.current.innerText = parseInt(hourRef.current.innerText) - 1
            } else {
                secondRef.current.innerText = second - 1;
            }


        }, 1000)
    }

    const stopInterval = () => {
        if (intervalRef.current) {
            handleSubmit()
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
        duration !== 0 &&
        <div className="detail-value">
            <span ref={hourRef} >{Math.floor(duration / 60)}</span> : <span ref={minuteRef} >{duration % 60}</span> : <span ref={secondRef} >00</span>
        </div>
    )
}