import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getOnlyUsers: jest.fn(),
            findOne: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            updatePutUser: jest.fn(),
            deleteUser: jest.fn(),
            updateLanguage: jest.fn(),
            updatePassword: jest.fn(),
            updateUserDetails: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
