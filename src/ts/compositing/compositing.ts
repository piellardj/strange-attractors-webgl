abstract class CompositingBase {
    public abstract initialize(): void;
    public abstract bindTopLayer(): void;
    public abstract compose(): void;
}

export default CompositingBase;
