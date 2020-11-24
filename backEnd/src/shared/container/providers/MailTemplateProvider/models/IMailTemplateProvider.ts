import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  // Normalmente, caso tenhamos um método que recebe mais de uma informação, vale a pena criar um DTO
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
