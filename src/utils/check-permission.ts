import { Company } from '@/company/entities/company.entity';
import { User } from '../user/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

export enum UserType {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USUARIO = 'usuario',
}

export const checkPermission = (
  user: User,
  action: string,
  companies?: Company[],
): boolean => {
  console.log('Tipo de usuário:', user.type);

  const companyIdsArray = companies?.map((c) => c.id) ?? [];

  switch (user.type.toLowerCase()) {
    case UserType.ADMIN:
      return true;

    case UserType.MANAGER:
      const isManagingCompany = user.companies.some((company) => {
        console.log('id encontrado no join', company.id);
        return companyIdsArray.includes(company.id);
      });
      console.log('Permissão de gerente:', isManagingCompany);

      if (isManagingCompany) {
        if (
          [
            'createUser',
            'updateCompany',
            'createApiKey',
            'disableApiKeyById',
            'update',
            'remove',
            'create',
            'createCompanyByManager',
          ].includes(action)
        ) {
          return true;
        }
        throw new BadRequestException('Permissão negada. Ação não permitida.');
      } else {
        throw new BadRequestException(
          'Permissão negada. O gerente só pode gerenciar suas próprias empresas.',
        );
      }

    case UserType.USUARIO:
      if (action === 'consult') {
        return true;
      }
      throw new BadRequestException(
        'Permissão negada. Usuário não tem permissão para realizar esta ação.',
      );

    default:
      throw new BadRequestException('Tipo de usuário não reconhecido.');
  }
};
