import { Test, TestingModule } from "@nestjs/testing";
import { UploadService } from "./upload.service";
import { CloudinaryService } from "./cloudinary/cloudinary.service";

describe("UploadService", () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService, CloudinaryService],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
