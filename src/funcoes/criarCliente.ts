import { APIGatewayEvent } from 'aws-lambda';
import { UserConfirmationData, UserDataUserPoolType } from 'types/UserTypes';

import { authenticateCognitoUser } from '../middles/provider/authenticateUser';
import { confirmarUsuario } from '../middles/provider/confirmarUsuario';
import { criarUsuario } from '../middles/provider/criarUsuario';
import sendResponse from '../utils/sendResponse';
import { validateCPF } from '../utils/validateCPF';

async function handler (event: APIGatewayEvent) {
  const { cpf } = JSON.parse(event.body as string);
  if (!validateCPF(cpf)) {
    return sendResponse(400, 'cpf inválido');
  }

  const clientData: UserConfirmationData = {
    Username: cpf,
    UserPoolId: process.env.CLIENTES_POOL_ID
  }

  const clientPoolData: UserDataUserPoolType = {
    Username: cpf,
    UserPoolId: process.env.CLIENTES_POOL_ID,
    ClientId: process.env.CLIENTES_POOL_CLIENT_ID,
    IdentityPoolId: process.env.CLIENTES_IDENTITY_POOL_ID,
  }

  try {
    await confirmarUsuario(clientData);
    const result = await authenticateCognitoUser(clientPoolData);
    return sendResponse(200, result);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'UserNotFoundException') {
      await criarUsuario(clientData);
      const result = await authenticateCognitoUser(clientPoolData);
      return sendResponse(200, result);
    } else {
      throw new Error(error as string);
    }
  }
}

export { handler };
