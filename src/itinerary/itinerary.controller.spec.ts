import { Test, TestingModule } from "@nestjs/testing";
import { ItinerariesController } from "./itinerary.controller";
import { ItinerariesService } from "./itinerary.service";

describe("ItinerariesController", () => {
  let controller: ItinerariesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItinerariesController],
      providers: [
        {
          provide: ItinerariesService,
          useValue: {
            getAllOrdered: jest.fn(),
            getId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            createDetails: jest.fn(),
            updateDetails: jest.fn(),
            deleteDetails: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ItinerariesController>(ItinerariesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
