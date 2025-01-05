import { Test, TestingModule } from "@nestjs/testing";
import { OperativeService } from "./operative.service";

describe("OperativeService", () => {
  let service: OperativeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperativeService],
    }).compile();

    service = module.get<OperativeService>(OperativeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
