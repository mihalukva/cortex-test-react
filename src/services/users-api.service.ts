/**
 * Represents row item info for users table
 */
export interface UserInfo {
  firstName: string;
  id: number;
  lastName: string;
  profession: Profession;
}

/**
 * Represents available user professions
 */
export enum Profession {
  ceo = "ceo",
  developer = "developer",
  manager = "manager",
}

/**
 * Represents available sorting directions
 */
export enum Direction {
  asc = "asc",
  desc = "desc",
  none = "none",
}

/**
 * Represents available table fields names
 */
export enum FieldName {
  firstName = "firstName",
  id = "id",
  lastName = "lastName",
  profession = "profession",
}

/**
 * Represents input info for table data sorting
 */
export interface SortItem {
  direction: Direction;
  field: FieldName;
}

/**
 * Represents output info for endpoints returned table fragments
 */
export interface TableData<T> {
  data: Array<T>;
  isHasMore: boolean;
}

/**
 * Represents mock users for backend database
 */
const users: Array<UserInfo> = [
  { firstName: "Alex", id: 1, lastName: "Tracker", profession: Profession.manager },
  { firstName: "Dmitriy", id: 2, lastName: "Doe", profession: Profession.ceo },
  { firstName: "Eugene", id: 3, lastName: "Sherman", profession: Profession.developer },
  { firstName: "Sergey", id: 4, lastName: "Howells", profession: Profession.developer },
  { firstName: "Maria", id: 5, lastName: "Warner", profession: Profession.developer },
  { firstName: "Zakhar", id: 6, lastName: "King", profession: Profession.developer },
  { firstName: "Vladislav", id: 7, lastName: "Bright", profession: Profession.ceo },
  { firstName: "Andrew", id: 8, lastName: "Walton", profession: Profession.ceo },
  { firstName: "Gregory", id: 9, lastName: "Warren", profession: Profession.ceo },
  { firstName: "Nikolay", id: 10, lastName: "Flynn", profession: Profession.ceo },
  { firstName: "Nina", id: 11, lastName: "Torres", profession: Profession.ceo },
  { firstName: "Alina", id: 12, lastName: "Flowers", profession: Profession.ceo },
  { firstName: "Rinat", id: 13, lastName: "Cunningham", profession: Profession.ceo },
  { firstName: "Sergey", id: 14, lastName: "Carter", profession: Profession.ceo },
  { firstName: "Ekaterina", id: 15, lastName: "Graves", profession: Profession.manager },
  { firstName: "Kiril", id: 16, lastName: "Tate", profession: Profession.manager },
  { firstName: "Maria", id: 17, lastName: "Campbell", profession: Profession.manager },
  { firstName: "Eugene", id: 18, lastName: "Marsh", profession: Profession.manager },
  { firstName: "Alex", id: 19, lastName: "Carroll", profession: Profession.manager },
  { firstName: "Ivan", id: 20, lastName: "Perkins", profession: Profession.developer },
  { firstName: "Kiril", id: 21, lastName: "Jenkins", profession: Profession.ceo },
  { firstName: "Alina", id: 22, lastName: "Peterson", profession: Profession.developer },
  { firstName: "Ivan", id: 23, lastName: "Gray", profession: Profession.manager },
];

/**
 * Represents class to handle users info on backend
 */
class UsersApiService {
  /**
   * Schedules to return fragment of users list from database
   * @param pageIndex - current page index. Available values is 1...N
   * @param sorts - an array of sort info to sort users list before return
   */
  public getUsers(pageIndex: number, sorts?: Array<SortItem>): Promise<TableData<UserInfo>> {
    return new Promise((resolve: Function, reject: Function) => {
      try {
        if (!pageIndex || isNaN(pageIndex) || pageIndex < 1) {
          throw new Error("Wrong page index");
        }

        const pageLength: number = 7;
        const startIndex: number = pageIndex * pageLength - pageLength;
        const endIndex: number = pageLength;

        const usersFragment: Array<UserInfo> = (
          !sorts?.length
            ? [...users]
            : sorts
                .filter((sort: SortItem) => sort.direction !== Direction.none)
                .reduce(
                  (_users: Array<UserInfo>, sort: SortItem) =>
                    _users.sort((_a: UserInfo, _b: UserInfo) => {
                      const a: UserInfo = sort.direction === Direction.asc ? _a : _b;
                      const b: UserInfo = sort.direction === Direction.asc ? _b : _a;
                      if (sort.field === FieldName.id) {
                        return a[sort.field] > b[sort.field] ? 1 : -1;
                      } else {
                        return a[sort.field].localeCompare(b[sort.field]);
                      }
                    }),
                  [...users]
                )
        ).splice(startIndex, endIndex);

        setTimeout(
          () =>
            resolve({
              data: usersFragment,
              isHasMore: !!usersFragment.length,
            }),
          750
        );
      } catch (error) {
        setTimeout(() => reject(error), 750);
      }
    });
  }
}

export const usersApiService = new UsersApiService();
