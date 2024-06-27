import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Problems = () => {
    const [problems, setProblems] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getProblems = async () => {
            try {
                const response = await axiosPrivate.get('/problemset', {
                    signal: controller.signal
                });
                console.log("Data:",response.data);
                isMounted && setProblems(response.data);
            } catch (err) {
                console.error(err);
            }
        }

        getProblems();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return (
        <>
            <h2>Problems List</h2>
            {problems?.length
                ? (
                    <ul>
                        {problems.map((p, i) => <li key={i}>{p?.title}</li>)}
                    </ul>
                ) : <p>No problems to display</p>
            }
        </>
    );
};

export default Problems;