import { Test, TestingModule } from "@nestjs/testing";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { CloudinaryService } from "./cloudinary/cloudinary.service";

describe("UploadController", () => {
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [UploadService, CloudinaryService],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
