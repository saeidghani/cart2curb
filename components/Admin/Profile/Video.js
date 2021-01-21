import React, {useState} from 'react';
import {Button, message, Upload} from 'antd';
import {useRouter} from "next/router";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";

import routes from "../../../constants/routes";
import {CloudUploadOutlined, UserOutlined} from "@ant-design/icons";

const Video = props => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.effects.adminProfile.addCategory);
    const token = useSelector(state => state?.adminAuth?.token);
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState('');

    const submitHandler = async (values) => {

        const {name, parent, description} = values;
        const body = {
            name, parent, description
        }

        const res = await dispatch.adminProfile.editCategory({storeId, categoryId, body, token});
        if (res) {
            router.push({pathname: routes.admin.stores.storeDetails, query: {storeId, storeType, tab: 'category'}})
        }
    };

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleUpload = info => {
        console.log(info);
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            setImageUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos${info?.file?.response?.data?.path || ''}`);
        }
    };

    const uploadProps = {
        action: `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/files/photos/`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        progress: {
            strokeColor: {
                '0%': '#ff4b45',
                '100%': '#87d068',
            },
            strokeWidth: 2,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
    };

    const UploadVideo = () => (<Upload
        name={'image'}
        listType="picture"
        className={'upload-list-inline'}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleUpload}
        {...uploadProps}
    >
        <div className="flex space-x-3">
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: 500, height: 500}}/> : <div
                className={'full-rounded text-overline bg-card flex items-center justify-center'}
                style={{width: 500, height: 500}}>
            </div>}
        </div>
    </Upload>);

    return (
        <div className="py-5">
            <div className="flex flex-col">
                <div className="">Upload Image</div>
                <div className="flex space-x-2 mt-3">
                    <UploadVideo/>
                </div>
            </div>
            <div className="flex justify-end space-x-2 mt-10">
                <Button
                    type="primary"
                    block
                    className='w-full md:w-32 ml-0 md:ml-5'
                    htmlType={'submit'}
                    loading={loading}
                >
                    Save
                </Button>
                <Link
                    href={{pathname: routes.admin.profile.index, query: {tab: 'promoCode'}}}
                >
                    <Button danger className='w-full md:w-32'>Cancel</Button>
                </Link>
            </div>
        </div>
    )
};

export default Video;