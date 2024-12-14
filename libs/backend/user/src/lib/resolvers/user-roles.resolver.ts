import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '@lpg-manager/db';
import { RoleService } from '@lpg-manager/role-service';

@Resolver()
export class UserRolesResolver {

  constructor(private roleService: RoleService) {
  }

  @Query(() => UserModel)
  async userRoles(
    @Args('userId') userId: string
  ) {
    const roles = await this.roleService.getUserRoles(userId);
    return {
      items: roles,
      meta: {
        totalItems: roles.length
      }
    }
  }
}
