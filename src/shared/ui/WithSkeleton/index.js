import React, { ReactNode } from 'react';
import { Spinner } from 'react-bootstrap';

export const WithSkeleton = (props) => {
	const { isLoading, isEmpty, error, skeletonSlot, emptySpaceSlot, emptyTextData, children } =
		props;
	if (error) {
		return <>Не удалось загрузить данные :(</>;
	}

	if (!isEmpty && !isLoading && !error) {
		return <>{ children }</>;
	}

	if (isLoading) {
		return <>{ skeletonSlot || <Spinner size='sm' /> }</>;
	}

	if (!isLoading && !error && isEmpty) {
		return <>{ emptySpaceSlot || emptyTextData || '' }</>;
	}

	return <>error</>;
};
