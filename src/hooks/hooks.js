import React, {
    useState,
    useEffect
} from 'react';

export function useFetchAPIData(fetchingFunc, dependencies) {
    const [isLoading, setIsLoading] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [fetchedData, setFetchedData] = useState(null);

    const onLoadingStart = () => {
        setIsLoading(true);
        setErrorMessage("");
    };

    const onError = (error) => {
        setIsLoading(false);
        setErrorMessage(error);
    };

    const onDataFetched = (data) => {
        setFetchedData(data);
        setIsLoading(false);
    };

    useEffect(() => {
        onLoadingStart();
        fetchingFunc()
            .then(
                (result) => {
                    const success = result && result.success;
                    if (success && result.data) {
                        //const fetchData = result && result.data;
                        onDataFetched(result.data);
                    } else {
                        onError(`Error occured obtaining data from server`);
                    }
                },
                (error) => {
                    onError(`Error occured during data fetch ${error?.message}`);
                }
            )
            .catch((error) => {
                onError(`Error occured after data fetched ${error?.message}`);
            });
    }, [...dependencies]);
    return [isLoading, errorMessage, fetchedData];
}