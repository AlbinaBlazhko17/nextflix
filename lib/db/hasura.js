async function queryHasuraGQL(operationsDoc, operationName, variables) {
	const result = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL, {
		method: 'POST',
		body: JSON.stringify({
			query: operationsDoc,
			variables: variables,
			operationName: operationName,
		}),
		headers: {
			'Content-Type': 'application/json',
			'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
		},
	});

	return await result.json();
}

const operationsDoc = `
	query MyQuery {
		users {
			id
			email
		}
	}

	mutation MyMutation {
		insert_stats(objects: {favorited: 1, id: 1, userId: "albinator", videoId: "ifgsdju4313", watched: true}) {
			affected_rows
		}
	}
`;

function fetchMyQuery() {
	return queryHasuraGQL(operationsDoc, 'MyQuery', {});
}

export async function startFetchMyQuery() {
	const { errors, data } = await fetchMyQuery();
	if (errors) {
		// handle those errors like a pro
		console.error(errors);
	}

	// do something great with this precious data
	console.log('Hasura', data);
}
