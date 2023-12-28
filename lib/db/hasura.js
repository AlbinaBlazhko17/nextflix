export async function createNewStats(token, { favorited, userId, watched, videoId }) {
	const operationsDoc = `
		mutation InsertStats($favorited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
			insert_stats_one(
				object: {
					favorited: $favorited, 
					userId: $userId, 
					watched: $watched, 
					videoId: $videoId
				}) {
					favorited
					id
					userId
				}
			}
	`;

	const response = await queryHasuraGQL(
		operationsDoc,
		'InsertStats',
		{ favorited, userId, watched, videoId },
		token,
	);

	return response;
}

export async function updateStats(token, { favorited, userId, watched, videoId }) {
	const operationsDoc = `
		mutation UpdateStats($favorited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
			update_stats(
				_set: {watched: $watched, favorited: $favorited}, 
				where: {
					userId: {_eq: $userId}, 
					videoId: {_eq: $videoId}
				}) {
				returning {
					favorited,
					userId,
					watched,
					videoId
				}
			}
		}
	`;

	const response = await queryHasuraGQL(
		operationsDoc,
		'UpdateStats',
		{ favorited, userId, watched, videoId },
		token,
	);

	return response;
}

export async function findVideoIdByUser(token, userId, videoId) {
	const operationsDoc = `
		query findVideoIdByUser($userId: String!, $videoId: String!) {
			stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
				userId
				id
				favorited
				videoId
				watched
			}
		}
	`;

	try {
		const res = await queryHasuraGQL(
			operationsDoc,
			'findVideoIdByUser',
			{
				userId,
				videoId,
			},
			token,
		);
		return res?.data?.stats;
	} catch (error) {
		console.error('findVideoIdByUser GraphQL request error:', error);
		throw error;
	}
}

export async function createNewUser(token, issuer, email, publicAddress) {
	const operationsDoc = `
		mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
			insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress }) {
				affected_rows
				returning {
					issuer
					id
					email
				}
			}
		}
	`;

	try {
		const res = await queryHasuraGQL(
			operationsDoc,
			'createNewUser',
			{
				issuer,
				email,
				publicAddress,
			},
			token,
		);
		return res?.data?.insert_users?.returning[0];
	} catch (error) {
		console.error('createNewUser GraphQL request error:', error);
		throw error;
	}
}

async function queryHasuraGQL(operationsDoc, operationName, variables) {
	try {
		const result = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL, {
			method: 'POST',
			body: JSON.stringify({
				query: operationsDoc,
				variables: variables || {},
				operationName: operationName || null,
			}),
			headers: {
				'Content-Type': 'application/json',
				'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
			},
		});

		return await result.json();
	} catch (error) {
		console.error('GraphQL request error:', error);
		throw error;
	}
}

export async function isNewUser(token, issuer) {
	const operationsDoc = `
		query isNewUser($issuer: String!) {
			users(where: { issuer: { _eq: $issuer }}) {
				id
				email
				issuer
			}
		}
	`;

	try {
		const res = await queryHasuraGQL(
			operationsDoc,
			'isNewUser',
			{
				issuer,
			},
			token,
		);

		return res?.data?.users?.length === 0;
	} catch (error) {
		console.error('isNewUser GraphQL request error:', error);
		throw error;
	}
}
