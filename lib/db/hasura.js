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
